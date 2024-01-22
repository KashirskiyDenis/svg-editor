'use strict';

document.addEventListener('DOMContentLoaded', function () {
	const svgns = 'http://www.w3.org/2000/svg';
	const resizes = ['resize-nw', 'resize-ne', 'resize-se', 'resize-sw'];
	
	let inputImage = document.getElementById('inputImage');
	let svg = document.getElementById('svg');
	let rotateArrow = document.getElementById('rotate-arrow');
	let corners = {};
	
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
		let coord = event.currentTarget.getBoundingClientRect();
		let x = +event.currentTarget.getAttribute('x');
		let y = +event.currentTarget.getAttribute('y');
		const neighbors = [
			{ dx: x, dy: y },
			{ dx: x + coord.width, dy: y },
			{ dx: x + coord.width, dy: y + coord.height },
			{ dx: x, dy: y + coord.height },
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
	
	let cornersToForeground = () => {
		for (let i = 0; i < 4; i++ ) {
			let corner = corners[resizes[i]];
			svg.appendChild(corner);
		}
	}
	
	let moveRotateArrow = (event) => {
		let figure = event.currentTarget.getBoundingClientRect();
		let x = event.offsetX - shiftX + figure.width + 8;
		let y = event.offsetY - shiftY - 24;
		rotateArrow.setAttribute('x', x);
		rotateArrow.setAttribute('y', y);
	};
	
	let addFigure = () => {
		let newRect = document.createElementNS(svgns, 'rect');
		
		newRect.setAttribute('id', 'react-id');
		newRect.setAttribute('x', '150');
		newRect.setAttribute('y', '150');
		newRect.setAttribute('width', '100');
		newRect.setAttribute('height', '100');
		newRect.setAttribute('fill', '#5cceee');
		newRect.setAttribute('stroke', '#000000');
		// newRect.setAttribute('transform', 'translate(0.5,0.5)');
		// newRect.setAttribute('transform', 'rotate(45, 200, 200)');
		
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
		
		shiftX = event.clientX - draggbleFigure.getBoundingClientRect().x //+ 0.5;
		shiftY = event.clientY - draggbleFigure.getBoundingClientRect().y //+ 0.5;

		cornersMove(event)
		cornersToForeground();
		moveRotateArrow(event);		
		
		svg.addEventListener('mousemove', mouseMoveFigure);
		svg.addEventListener('mousemove', figureMove);
		
		draggbleFigure.addEventListener('mouseup', mouseUpFigure);
	};
	
	let mouseMoveFigure = (event) => {
		draggbleFigure.setAttribute('x', event.offsetX - shiftX);
		draggbleFigure.setAttribute('y', event.offsetY - shiftY);
		draggbleFigure.setAttribute('filter', 'drop-shadow(5px 5px 5px #aaaaaa)');
		cornersDisplayNone();
		rotateArrow.setAttribute('display', 'none');
	}	
	
	function mouseUpFigure(event) {
		// if (!figureMoveFlag) {
			// mouseClickFigure(event);
		// }
		svg.removeEventListener('mousemove', mouseMoveFigure);
		svg.removeEventListener('mousemove', figureMove);
		this.removeEventListener('mouseup', mouseUpFigure);
		this.removeAttribute('filter');

		draggbleFigure = null;		
		// figureMoveFlag = false;
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