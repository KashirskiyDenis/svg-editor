'use strict';

document.addEventListener('DOMContentLoaded', function () {
	const svgns = 'http://www.w3.org/2000/svg';
	const resizes = ['resize-nw', 'resize-ne', 'resize-se', 'resize-sw'];
	
	let inputImage = document.getElementById('inputImage');
	let svg = document.getElementById('svg');
	let rotateArrow = document.getElementById('rotate-arrow');
	let corners = {};
	
	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}
	
	for (let i = 0; i < 4; i++ ) {
		let newCircle = document.createElementNS(svgns, 'circle');
		newCircle.setAttribute('id', resizes[i]);
		newCircle.setAttribute('cx', 0);
		newCircle.setAttribute('cy', 0);
		newCircle.setAttribute('r', '5');
		newCircle.setAttribute('fill', '#29b6f2');
		newCircle.setAttribute('display', 'none');
		corners[resizes[i]] = newCircle;
		svg.appendChild(newCircle);
	}
	
	let cornersDisplayNone = () => {
		for (let i = 0; i < 4; i++ ) {
			corners[resizes[i]].setAttribute('display', 'none');
		}		
	};
	
	let cornersDisplayBlock = () => {
		for (let i = 0; i < 4; i++ ) {
			corners[resizes[i]].setAttribute('display', 'block');
		}
	};
	
	let cornersMove = (event) => {
		let width = +event.currentTarget.getAttribute('width');
		let height = +event.currentTarget.getAttribute('height');
		let x = +event.currentTarget.getAttribute('x');
		let y = +event.currentTarget.getAttribute('y');
		let neighbors = [
			{ dx: x, dy: y },
			{ dx: x + width, dy: y },
			{ dx: x + width, dy: y + height },
			{ dx: x, dy: y + height },
		];
		let rotate = event.currentTarget.getAttribute('transform');
		for (let i = 0; i < 4; i++ ) {
			let corner = corners[resizes[i]];
			if (rotate) {
				corner.setAttribute('transform', rotate);
			}
			corner.setAttribute('cx', neighbors[i].dx);
			corner.setAttribute('cy', neighbors[i].dy);
		}
	};
	
	let cornersAndRotateArrowToForeground = () => {
		for (let i = 0; i < 4; i++ ) {
			let corner = corners[resizes[i]];
			svg.appendChild(corner);
		}
		svg.appendChild(rotateArrow);
	}
	
	let moveRotateArrow = (event) => {
		let width = +event.currentTarget.getAttribute('width');
		let x = +event.currentTarget.getAttribute('x') + width + 8;
		let y = +event.currentTarget.getAttribute('y') - 24;
		let rotate = event.currentTarget.getAttribute('transform');
		
		rotateArrow.setAttribute('x', x);
		rotateArrow.setAttribute('y', y);
		if (rotate) {
			rotateArrow.setAttribute('transform', rotate);
		}
	};
	
	let calculateCenterCoordinates = () => {
		let width = +draggbleFigure.getAttribute('width');
		let height = +draggbleFigure.getAttribute('height');
		let x = +draggbleFigure.getAttribute('x');
		let y = +draggbleFigure.getAttribute('y');
		let neighbors = [
			{ dx: x, dy: y },
			{ dx: x + width, dy: y },
			{ dx: x + width, dy: y + height },
			{ dx: x, dy: y + height },
		];
		let newX = (neighbors[0].dx + neighbors[1].dx) / 2;
		let newY = (neighbors[1].dy + neighbors[2].dy) / 2;
		
		return { rotateX: newX, rotateY: newY };
	};
	
	let addFigure = () => {
		let newRect = document.createElementNS(svgns, 'rect');
		
		newRect.setAttribute('id', 'react-id');
		newRect.setAttribute('x', '150');
		newRect.setAttribute('y', '150');
		newRect.setAttribute('width', '100');
		newRect.setAttribute('height', '100');
		newRect.setAttribute('fill', '#5cceee');
		// newRect.setAttribute('stroke', '#000000');
		// newRect.setAttribute('transform', 'translate(0.5,0.5)');
		newRect.setAttribute('transform', `rotate(${getRandomInt(361)}, 200, 200)`);
		
		newRect.addEventListener('mousedown', mouseDownFigure);
		svg.appendChild(newRect);
	};
	
	inputImage.addEventListener('click', addFigure);	
	
	document.getElementById('saveImage').addEventListener('click', () => {
	});
	
	let draggbleFigure = null;
	let shiftX = null;
	let shiftY = null;
	let figureMoveFlag = false;
	
	let mouseClickFigure = (event) => {
		// cornersMove(event);
		// cornersDisplayBlock();
		// cornersToForeground();
	};
	
	let figureMove = () => {
		figureMoveFlag = true;
	}	
	
	let mouseDownFigure = (event) => {
		draggbleFigure = event.currentTarget;
		svg.appendChild(draggbleFigure);
		
		shiftX = event.clientX - draggbleFigure.getBoundingClientRect().x; //+ 0.5;
		shiftY = event.clientY - draggbleFigure.getBoundingClientRect().y; //+ 0.5;
		
		cornersMove(event);
		cornersAndRotateArrowToForeground();
		moveRotateArrow(event);		
		
		svg.addEventListener('mousemove', mouseMoveFigure);
		
		draggbleFigure.addEventListener('mouseup', mouseUpFigure);
	};
	
	let mouseMoveFigure = (event) => {

		let rotate = draggbleFigure.getAttribute('transform');
		let angle, rotateX, rotateY;
		
		if (rotate) {
			angle = +rotate.split('(')[1].split(',')[0];
			({ rotateX, rotateY } = calculateCenterCoordinates());
			console.log(rotateX);
			console.log(rotateY);
		}
		
		console.log('event.offsetX - shiftX ' + (event.offsetX - shiftX));
		console.log('event.offsetY - shiftY ' + (event.offsetY - shiftY));
		
		draggbleFigure.setAttribute('x', event.offsetX - shiftX);
		draggbleFigure.setAttribute('y', event.offsetY - shiftY);
		
		if (rotate)
			draggbleFigure.setAttribute('transform', `rotate(${angle}, ${rotateX}, ${rotateY})`);
		
		draggbleFigure.setAttribute('filter', 'drop-shadow(5px 5px 5px #aaaaaa)');
		rotateArrow.setAttribute('display', 'none');
		cornersDisplayNone();
	}	
	
	function mouseUpFigure(event) {

		svg.removeEventListener('mousemove', mouseMoveFigure);
		draggbleFigure.removeEventListener('mouseup', mouseUpFigure);
		draggbleFigure.removeAttribute('filter');
		
		draggbleFigure = null;		
		cornersMove(event);
		cornersDisplayBlock();
		moveRotateArrow(event);			
		
		rotateArrow.setAttribute('display', 'block');
	}
	
	function draw() {
		
	}
	
	function changeInput() {
		let image = new Image();
		image.onload = draw;
		image.onerror = () => {
			console.log('Error loading')
		};
		if (this.files[0]) {
			image.src = URL.createObjectURL(this.files[0]);
			console.log(this.files[0]);
		}
	}
	
	//inputImage.addEventListener('change', changeInput);
});	