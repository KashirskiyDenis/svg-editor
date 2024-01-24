'use strict';

document.addEventListener('DOMContentLoaded', function () {
	const svgns = 'http://www.w3.org/2000/svg';
	const resizes = ['nw-resize', 'ne-resize', 'se-resize', 'sw-resize'];
	
	let inputImage = document.getElementById('inputImage');
	let svg = document.getElementById('svg');
	let rotateArrow = document.getElementById('rotate-arrow');
	let corners = {};
	
	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}
	
	let createCorners = () => {
		for (let i = 0; i < 4; i++ ) {
			let corner = document.createElementNS(svgns, 'circle');
			corner.setAttribute('id', resizes[i]);
			corner.setAttribute('cx', 0);
			corner.setAttribute('cy', 0);
			corner.setAttribute('r', '5');
			corner.setAttribute('fill', '#29b6f2');
			corner.setAttribute('display', 'none');
			corner.addEventListener('mousedown', cornerMouseDown);
			
			// newCircle.setAttribute('style', `cursor: ${resizes[i]};`);
			corners[resizes[i]] = corner;
			svg.appendChild(corner);
		}
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
	
	let cornersMove = () => {
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
		let rotate = draggbleFigure.getAttribute('transform');
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
		let width = +draggbleFigure.getAttribute('width');
		let x = +draggbleFigure.getAttribute('x') + width + 8;
		let y = +draggbleFigure.getAttribute('y') - 24;
		let rotate = draggbleFigure.getAttribute('transform');
		
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
		let newX = ~~(neighbors[0].dx + neighbors[1].dx) / 2;
		let newY = ~~(neighbors[1].dy + neighbors[2].dy) / 2;
		
		return { rotateX: newX, rotateY: newY };
	};
	
	let addFigure = () => {
		let newRect = document.createElementNS(svgns, 'rect');
		
		newRect.setAttribute('id', 'react-id');
		newRect.setAttribute('x', '150');
		newRect.setAttribute('y', '150');
		newRect.setAttribute('width', '100');
		newRect.setAttribute('height', '100');
		newRect.setAttribute('fill', '#d5e8d4');
		// newRect.setAttribute('stroke', '#000000');
		// newRect.setAttribute('transform', 'translate(0.5,0.5)');
		newRect.setAttribute('transform', `rotate(${getRandomInt(361)}, 200, 200)`);
		
		newRect.addEventListener('mousedown', figureMouseDown);
		svg.appendChild(newRect);
	};
	
	inputImage.addEventListener('click', addFigure);	
	
	document.getElementById('saveImage').addEventListener('click', () => {
	});
	
	let draggbleFigure = null;
	let shiftX = null;
	let shiftY = null;
	let figureMoveFlag = false;
	
	let figureMouseDown = (event) => {
		draggbleFigure = event.currentTarget;
		svg.appendChild(draggbleFigure);
		
		let rotate = draggbleFigure.getAttribute('transform');
		
		if (rotate) {
			draggbleFigure.removeAttribute('transform');
		}
		
		shiftX = ~~(event.clientX - draggbleFigure.getBoundingClientRect().x); //+ 0.5;
		shiftY = ~~(event.clientY - draggbleFigure.getBoundingClientRect().y); //+ 0.5;
		
		if (rotate) {
			draggbleFigure.setAttribute('transform', rotate);
		}
		
		cornersMove();
		cornersAndRotateArrowToForeground();
		moveRotateArrow();		
		
		svg.addEventListener('mousemove', figureMouseDownAndMove);
		draggbleFigure.addEventListener('mouseup', figureMouseUp);
	};
	
	let figureMouseDownAndMove = (event) => {
		let rotate = draggbleFigure.getAttribute('transform');
		let angle, rotateX, rotateY;
		
		if (rotate) {
			angle = +rotate.split('(')[1].split(',')[0];
			({ rotateX, rotateY } = calculateCenterCoordinates());
		}
		
		draggbleFigure.setAttribute('x', ~~(event.offsetX - shiftX));
		draggbleFigure.setAttribute('y', ~~(event.offsetY - shiftY));
		
		if (rotate) {
			draggbleFigure.setAttribute('transform', `rotate(${angle}, ${rotateX}, ${rotateY})`);
		}
		
		draggbleFigure.setAttribute('filter', 'drop-shadow(5px 5px 5px #aaaaaa)');
		rotateArrow.setAttribute('display', 'none');
		cornersDisplayNone();
	}	
	
	let figureMouseUp = (event) => {
		svg.removeEventListener('mousemove', figureMouseDownAndMove);
		draggbleFigure.removeEventListener('mouseup', figureMouseUp);
		draggbleFigure.removeAttribute('filter');
		
		// draggbleFigure = null;
		cornersMove();
		cornersDisplayBlock();
		moveRotateArrow();			
		
		rotateArrow.setAttribute('display', 'block');
	}
	
	let startRotationX;
	let startRotationY;
	let startRotationAngle = 0;
	
	let rotateArrowMouseDown = (event) => {
		let rotateFigure = draggbleFigure.cloneNode(true);
		rotateFigure.setAttribute('id', 'id-rotate-figure');
		rotateFigure.setAttribute('fill', 'transparent');
		rotateFigure.setAttribute('stroke', '#29b6f2');
		rotateFigure.setAttribute('stroke-dasharray', '3');
		svg.appendChild(rotateFigure);
		
		cornersDisplayNone();
		
		let rotate = draggbleFigure.getAttribute('transform');
		
		if (rotate) {
			startRotationAngle = +rotate.split('(')[1].split(',')[0];
		}
		
		startRotationX = event.offsetX;
		startRotationY = event.offsetY;
		
		svg.addEventListener('mousemove', rotateArrowMouseDownAndMove);
		svg.addEventListener('mouseup', rotateArrowMouseUp);
	};
	
	let angleBetweenVectors = (coordVector1_b, coordVector1_e, coordVector2_b, coordVector2_e) => {
		let vector1 = {x: coordVector1_e.x - coordVector1_b.x, y: coordVector1_e.y - coordVector1_b.y};
		let vector2 = {x: coordVector2_e.x - coordVector2_b.x, y: coordVector2_e.y - coordVector2_b.y};
		let angleInRadians = Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x);
		let angleInDegrees = (180 / Math.PI) * angleInRadians;
		angleInDegrees += startRotationAngle;
		
		if (angleInDegrees < 0) {
			angleInDegrees += 360;
		}
		
		return ~~angleInDegrees;
	};
	
	let rotateArrowMouseDownAndMove = (event) => {
		let rotateFigure = document.getElementById('id-rotate-figure');
		let rotate = draggbleFigure.getAttribute('transform');
		let { rotateX, rotateY } = calculateCenterCoordinates();
		let angle = angleBetweenVectors({ x: rotateX, y: rotateY }, { x: startRotationX, y: startRotationY }, { x: rotateX, y: rotateY }, { x: event.offsetX, y: event.offsetY });
		
		rotateFigure.setAttribute('transform', `rotate(${angle}, ${rotateX}, ${rotateY})`);
	};	
	
	let rotateArrowMouseUp = (event) => {
		let newTransform = document.getElementById('id-rotate-figure').getAttribute('transform');
		
		draggbleFigure.setAttribute('transform', newTransform);
		document.getElementById('id-rotate-figure').remove();
		
		cornersMove();
		cornersDisplayBlock();
		moveRotateArrow();	
		
		svg.removeEventListener('mousemove', rotateArrowMouseDownAndMove);
		svg.removeEventListener('mouseup', rotateArrowMouseUp);
	};
	
	rotateArrow.addEventListener('mousedown', rotateArrowMouseDown);
	
	let startCornerX;
	let startCornerY;
	
	let cornerMouseDown = (event) => {
		let corner = event.currentTarget;
		let startCornerX = corner.getAttribute('x');
		let startCornerY = corner.getAttribute('y');
		
		rotateArrow.setAttribute('display', 'none');
		
		svg.addEventListener('mousemove', cornerMouseDownAndMove);
		svg.addEventListener('mouseup', cornerMouseUp);		
	};
	
	let cornerMouseDownAndMove = (event) => {
		let width = draggbleFigure.getAttribute('width');
		let height = draggbleFigure.getAttribute('heigth');
		let angle = angleBetweenVectors({ x: rotateX, y: rotateY }, { x: startRotationX, y: startRotationY }, { x: rotateX, y: rotateY }, { x: event.offsetX, y: event.offsetY });
		
		rotateFigure.setAttribute('transform', `rotate(${angle}, ${rotateX}, ${rotateY})`);
	};		
	
	let cornerMouseUp = (event) => {
		
		
		rotateArrow.setAttribute('display', 'block');
		
		svg.removeEventListener('mousemove', cornerMouseDownAndMove);
		svg.removeEventListener('mouseup', cornerMouseUp);
	};
	
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
	
	createCorners();
	//inputImage.addEventListener('change', changeInput);
});	