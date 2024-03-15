'use strict';

document.addEventListener('DOMContentLoaded', function () {
	const svgns = 'http://www.w3.org/2000/svg';
	const resizes = ['nw-resize', 'ne-resize', 'se-resize', 'sw-resize'];

	let inputImage = document.getElementById('inputImage');
	let svg = document.getElementById('svg');
	let rotateArrow = document.getElementById('rotate-arrow');
	let trash = document.getElementById('trash');
	let corners = {};

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	let createCorners = () => {
		for (let i = 0; i < 4; i++) {
			let corner = document.createElementNS(svgns, 'circle');
			corner.setAttribute('id', resizes[i]);
			corner.setAttribute('cx', 0);
			corner.setAttribute('cy', 0);
			corner.setAttribute('r', '8');
			corner.setAttribute('fill', '#29b6f2');
			corner.setAttribute('display', 'none');
			corner.setAttribute('opacity', '0.5');
			corner.addEventListener('pointerdown', cornerMouseDown);
			corners[resizes[i]] = corner;
			svg.appendChild(corner);
		}
	}

	let cornersDisplayNone = () => {
		for (let i = 0; i < 4; i++) {
			corners[resizes[i]].setAttribute('display', 'none');
		}
	};

	let cornersDisplayBlock = () => {
		for (let i = 0; i < 4; i++) {
			corners[resizes[i]].setAttribute('display', 'block');
		}
	};

	let cornersDisplayNoneBesides = (corner) => {
		for (let i = 0; i < 4; i++) {
			if (corner != corners[resizes[i]]) {
				corners[resizes[i]].setAttribute('display', 'none');
			}
		}
	};

	let toForeground = () => {
		for (let i = 0; i < 4; i++) {
			let corner = corners[resizes[i]];
			svg.appendChild(corner);
		}
		svg.appendChild(rotateArrow);
		svg.appendChild(trash);
	}

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
		for (let i = 0; i < 4; i++) {
			let corner = corners[resizes[i]];
			if (rotate) {
				corner.setAttribute('transform', rotate);
			} else {
				if (corner.getAttribute('transform')) {
					corner.removeAttribute('transform');
				}
			}
			corner.setAttribute('cx', neighbors[i].dx);
			corner.setAttribute('cy', neighbors[i].dy);
		}
	};

	let rotateArrowMove = () => {
		let width = +draggbleFigure.getAttribute('width');
		let x = +draggbleFigure.getAttribute('x') + width + 16;
		let y = +draggbleFigure.getAttribute('y') - 32;
		let rotate = draggbleFigure.getAttribute('transform');

		rotateArrow.setAttribute('x', x);
		rotateArrow.setAttribute('y', y);
		if (rotate) {
			rotateArrow.setAttribute('transform', rotate);
		} else {
			if (rotateArrow.getAttribute('transform')) {
				rotateArrow.removeAttribute('transform');
			}
		}
	};

	let trashMove = () => {
		let width = +draggbleFigure.getAttribute('width');
		let x = +draggbleFigure.getAttribute('x') + width + 16;
		let y = +draggbleFigure.getAttribute('y');
		let rotate = draggbleFigure.getAttribute('transform');

		trash.setAttribute('x', x);
		trash.setAttribute('y', y);
		if (rotate) {
			trash.setAttribute('transform', rotate);
		} else {
			if (trash.getAttribute('transform')) {
				trash.removeAttribute('transform');
			}
		}
	};

	let calculateCenterCoordinates = () => {
		let x = +draggbleFigure.getAttribute('x');
		let y = +draggbleFigure.getAttribute('y');
		let width = +draggbleFigure.getAttribute('width');
		let height = +draggbleFigure.getAttribute('height');
		let neighbors = [
			{ dx: x, dy: y },
			{ dx: x + width, dy: y },
			{ dx: x + width, dy: y + height },
			{ dx: x, dy: y + height },
		];
		let newX = (neighbors[0].dx + neighbors[1].dx + neighbors[2].dx + neighbors[3].dx) / 4;
		let newY = (neighbors[0].dy + neighbors[1].dy + neighbors[2].dy + neighbors[3].dy) / 4;

		return { rotateX: newX, rotateY: newY };
	};

	let changeRotateCoordinates = () => {
		let rotate = draggbleFigure.getAttribute('transform');

		if (rotate) {
			let angle = +rotate.split('(')[1].split(',')[0];
			let { rotateX, rotateY } = calculateCenterCoordinates();
			draggbleFigure.setAttribute('transform', `rotate(${angle}, ${rotateX}, ${rotateY})`);
		}
	};

	let draggbleFigure = null;
	let shiftX = null;
	let shiftY = null;

	let figureMouseDown = (event) => {
		draggbleFigure = event.currentTarget;
		svg.appendChild(draggbleFigure);

		let rotate = draggbleFigure.getAttribute('transform');

		if (rotate) {
			draggbleFigure.removeAttribute('transform');
		}

		shiftX = ~~(event.clientX - draggbleFigure.getBoundingClientRect().x);
		shiftY = ~~(event.clientY - draggbleFigure.getBoundingClientRect().y);

		if (rotate) {
			draggbleFigure.setAttribute('transform', rotate);
		}

		cornersMove();
		toForeground();
		rotateArrowMove();
		trashMove();

		svg.addEventListener('pointermove', figureMouseDownAndMove);
		draggbleFigure.addEventListener('pointerup', figureMouseUp);
	};

	let figureMouseDownAndMove = (event) => {
		draggbleFigure.setAttribute('x', (event.offsetX - shiftX));
		draggbleFigure.setAttribute('y', (event.offsetY - shiftY));
		draggbleFigure.setAttribute('filter', 'drop-shadow(5px 5px 5px #aaaaaa)');

		changeRotateCoordinates();

		rotateArrow.setAttribute('display', 'none');
		trash.setAttribute('display', 'none');
		cornersDisplayNone();
	}

	let figureMouseUp = () => {
		svg.removeEventListener('pointermove', figureMouseDownAndMove);
		draggbleFigure.removeEventListener('pointerup', figureMouseUp);
		draggbleFigure.removeAttribute('filter');

		cornersMove();
		cornersDisplayBlock();
		rotateArrowMove();
		trashMove()
		rotateArrow.setAttribute('display', 'block');
		trash.setAttribute('display', 'block');
	}

	let startRotationX;
	let startRotationY;
	let startRotationAngle = 0;

	let addBorderRotate = () => {
		let rotateFigure = document.createElementNS(svgns, 'rect');
		rotateFigure.setAttribute('id', 'id-rotate-figure');
		rotateFigure.setAttribute('x', draggbleFigure.getAttribute('x'));
		rotateFigure.setAttribute('y', draggbleFigure.getAttribute('y'));
		rotateFigure.setAttribute('width', draggbleFigure.getAttribute('width'));
		rotateFigure.setAttribute('height', draggbleFigure.getAttribute('height'));
		if (draggbleFigure.getAttribute('transform')) {
			rotateFigure.setAttribute('transform', draggbleFigure.getAttribute('transform'));
		}
		rotateFigure.setAttribute('fill', 'transparent');
		rotateFigure.setAttribute('stroke', '#29b6f2');
		rotateFigure.setAttribute('stroke-dasharray', '3');
		svg.appendChild(rotateFigure);
	};

	let rotateArrowMouseDown = (event) => {
		addBorderRotate();
		cornersDisplayNone();

		let rotate = draggbleFigure.getAttribute('transform');

		if (rotate) {
			startRotationAngle = +rotate.split('(')[1].split(',')[0];
		}

		startRotationX = event.offsetX;
		startRotationY = event.offsetY;
		// console.log('startRotationX ' + event.offsetX);
		// console.log('startRotationY ' + event.offsetY);

		svg.addEventListener('pointermove', rotateArrowMouseDownAndMove);
		svg.addEventListener('pointerup', rotateArrowMouseUp);
	};

	let angleBetweenVectors = (coordVector1_b, coordVector1_e, coordVector2_b, coordVector2_e) => {
		let vector1 = { x: coordVector1_e.x - coordVector1_b.x, y: coordVector1_e.y - coordVector1_b.y };
		let vector2 = { x: coordVector2_e.x - coordVector2_b.x, y: coordVector2_e.y - coordVector2_b.y };
		let angleInRadians = Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x);
		let angleInDegrees = (180 / Math.PI) * angleInRadians;
		angleInDegrees += startRotationAngle;

		if (angleInDegrees < 0) {
			angleInDegrees += 360;
		}

		return ~~(angleInDegrees % 360);
	};

	let rotateArrowMouseDownAndMove = (event) => {
		let rotateFigure = document.getElementById('id-rotate-figure');
		let { rotateX, rotateY } = calculateCenterCoordinates();
		let angle = angleBetweenVectors({ x: rotateX, y: rotateY }, { x: startRotationX, y: startRotationY }, { x: rotateX, y: rotateY }, { x: event.offsetX, y: event.offsetY });

		// console.log(`rotate(${angle}, ${rotateX}, ${rotateY})`);
		rotateFigure.setAttribute('transform', `rotate(${angle}, ${rotateX}, ${rotateY})`);
	};

	let rotateArrowMouseUp = () => {
		let newTransform = document.getElementById('id-rotate-figure').getAttribute('transform');

		if (newTransform) {
			draggbleFigure.setAttribute('transform', newTransform);
		}
		document.getElementById('id-rotate-figure').remove();

		cornersMove();
		cornersDisplayBlock();
		rotateArrowMove();
		trashMove()

		svg.removeEventListener('pointermove', rotateArrowMouseDownAndMove);
		svg.removeEventListener('pointerup', rotateArrowMouseUp);
	};

	rotateArrow.addEventListener('pointerdown', rotateArrowMouseDown);

	let removeFigure = () => {
		draggbleFigure.remove();
		cornersDisplayNone();
		rotateArrow.setAttribute('display', 'none');
		trash.setAttribute('display', 'none');
	};

	trash.addEventListener('click', removeFigure);

	let lineA, lineB;
	let currentCorner;
	let cornerShiftX;
	let cornerShiftY;
	let startX, startY;
	let startWidth, startHeight;

	let getCenterCornerCoordinates = (corner) => {
		let angleInRadians = 0;
		let rotate = draggbleFigure.getAttribute('transform');

		if (rotate) {
			let angle = +rotate.split('(')[1].split(',')[0];
			angleInRadians = angle * Math.PI / 180;
		}

		let cx = +corner.getAttribute('cx');
		let cy = +corner.getAttribute('cy');
		let { rotateX, rotateY } = calculateCenterCoordinates();
		let newX = rotateX + (cx - rotateX) * Math.cos(angleInRadians) - (cy - rotateY) * Math.sin(angleInRadians);
		let newY = rotateY + (cx - rotateX) * Math.sin(angleInRadians) + (cy - rotateY) * Math.cos(angleInRadians);

		return { x: newX, y: newY };
	};

	let getCoordinatesLineA = (corner) => {
		let cornerA;

		if (corner.id == 'nw-resize') {
			cornerA = getCenterCornerCoordinates(corners['sw-resize']);
		} else if (corner.id == 'ne-resize') {
			cornerA = getCenterCornerCoordinates(corners['nw-resize']);
		} else if (corner.id == 'se-resize') {
			cornerA = getCenterCornerCoordinates(corners['sw-resize']);
		} else if (corner.id == 'sw-resize') {
			cornerA = getCenterCornerCoordinates(corners['nw-resize']);
		}

		return { x: cornerA.x, y: cornerA.y };
	};

	let cornerMouseDown = (event) => {
		currentCorner = event.currentTarget;
		lineB = getCenterCornerCoordinates(currentCorner);
		lineA = getCoordinatesLineA(currentCorner);

		cornerShiftX = lineB.x - event.offsetX;
		cornerShiftY = lineB.y - event.offsetY;

		startWidth = +draggbleFigure.getAttribute('width');
		startHeight = +draggbleFigure.getAttribute('height');
		startX = +draggbleFigure.getAttribute('x');
		startY = +draggbleFigure.getAttribute('y');

		cornersDisplayNoneBesides(currentCorner);
		rotateArrow.setAttribute('display', 'none');
		trash.setAttribute('display', 'none');

		svg.addEventListener('pointermove', cornerMouseDownAndMove);
		svg.addEventListener('pointerup', cornerMouseUp);
	};

	let pointRelativeToLine = (a, b, c) => {
		let p = c.x * (b.y - a.y) - c.y * (b.x - a.x) + a.y * b.x - a.x * b.y;
		return p;
	};

	let distanceFromPointToLine = (a, b, c) => {
		let p = Math.abs(pointRelativeToLine(a, b, c));
		let base = Math.sqrt((b.y - a.y) ** 2 + (b.x - a.x) ** 2);

		return p / base;
	};

	let cornerMouseDownAndMove = (event) => {
		let newWidth = startWidth;
		let newHeight = startHeight;
		let newX = startX;
		let newY = startY;
		let currentX = event.offsetX + cornerShiftX;
		let currentY = event.offsetY + cornerShiftY;

		let p = pointRelativeToLine(lineA, lineB, { x: currentX, y: currentY });
		let distance = distanceFromPointToLine(lineA, lineB, { x: currentX, y: currentY });

		if (currentCorner.id == 'nw-resize') {
			distance = p < 0 ? -1 * distance : distance;
			newX -= distance;
			newY -= distance;
		} else if (currentCorner.id == 'ne-resize') {
			distance = p < 0 ? -1 * distance : distance;
			newY -= distance;
		} else if (currentCorner.id == 'se-resize') {
			distance = p < 0 ? distance : -1 * distance;
		} else if (currentCorner.id == 'sw-resize') {
			distance = p < 0 ? distance : -1 * distance;
			newX -= distance;
		}

		newWidth += distance;
		newHeight += distance;
		newWidth = newWidth < 0 ? 1 : newWidth;
		newHeight = newHeight < 0 ? 1 : newHeight;

		draggbleFigure.setAttribute('x', newX);
		draggbleFigure.setAttribute('y', newY);
		draggbleFigure.setAttribute('width', newWidth);
		draggbleFigure.setAttribute('height', newHeight);

		cornersMove();
	};

	let cornerMouseUp = () => {
		repositionfigureAfterScale();
		rotateArrowMove();
		trashMove();
		cornersDisplayBlock();
		rotateArrow.setAttribute('display', 'block');
		trash.setAttribute('display', 'block');

		svg.removeEventListener('pointermove', cornerMouseDownAndMove);
		svg.removeEventListener('pointerup', cornerMouseUp);
	};

	let repositionfigureAfterScale = () => {
		let coord = [];
		let angleInRadians;
		let rotate = draggbleFigure.getAttribute('transform');
		let rotateX, rotateY;
		let newRotateX, newRotateY;

		if (rotate) {
			let angle = +rotate.split('(')[1].split(',')[0];
			angleInRadians = angle * Math.PI / 180;
			rotateX = +rotate.split(', ')[1];
			rotateY = +rotate.split(', ')[2].slice(0, -1);

			for (let i = 0; i < 4; i++) {
				coord[i] = {
					cx: corners[resizes[i]].getAttribute('cx'),
					cy: corners[resizes[i]].getAttribute('cy'),
				}
				coord[i].x = rotateX + (coord[i].cx - rotateX) * Math.cos(angleInRadians) - (coord[i].cy - rotateY) * Math.sin(angleInRadians);
				coord[i].y = rotateY + (coord[i].cx - rotateX) * Math.sin(angleInRadians) + (coord[i].cy - rotateY) * Math.cos(angleInRadians);
			}
			newRotateX = (coord[0].x + coord[1].x + coord[2].x + coord[3].x) / 4;
			newRotateY = (coord[0].y + coord[1].y + coord[2].y + coord[3].y) / 4;

			let delta = +draggbleFigure.getAttribute('width') / 2;
			let x = newRotateX - delta;
			let y = newRotateY - delta;

			draggbleFigure.setAttribute('x', x);
			draggbleFigure.setAttribute('y', y);
			draggbleFigure.setAttribute('transform', `rotate(${angle}, ${newRotateX}, ${newRotateY})`);
		}
	};

	createCorners();

	let addDot = (cx, cy, color = 'red', transform) => {
		let corner = document.createElementNS(svgns, 'circle');
		corner.setAttribute('cx', cx);
		corner.setAttribute('cy', cy);
		corner.setAttribute('r', '2');
		corner.setAttribute('fill', color);
		if (transform) {
			corner.setAttribute('transform', transform);
		}
		svg.appendChild(corner);
	};

	function draw() {
		let newImage = document.createElementNS(svgns, 'image');
		newImage.setAttribute('x', '25');
		newImage.setAttribute('y', '25');
		newImage.setAttribute('width', '200');
		newImage.setAttribute('height', '200');
		newImage.setAttribute('href', this.src);
		newImage.addEventListener('pointerdown', figureMouseDown);
		svg.appendChild(newImage);
	}

	function changeInput() {
		let image = new Image();
		image.onload = draw;
		image.onerror = () => {
			console.log('Error loading')
		};
		if (this.files[0]) {
			image.src = URL.createObjectURL(this.files[0]);

			var reader = new FileReader();
			reader.onloadend = function () {
				// console.log('RESULT', reader.result)
			}
			reader.readAsDataURL(this.files[0]);
			console.log(this.files[0]);
		}
	}

	inputImage.addEventListener('change', changeInput);

	let addFigure = () => {
		let newRect = document.createElementNS(svgns, 'rect');

		newRect.setAttribute('id', 'react-id');
		newRect.setAttribute('x', '50');
		newRect.setAttribute('y', '50');
		newRect.setAttribute('width', '150');
		newRect.setAttribute('height', '150');
		newRect.setAttribute('fill', '#d5e8d4');
		newRect.setAttribute('opacity', '0.8');
		// newRect.setAttribute('stroke', '#000000');
		// newRect.setAttribute('transform', 'translate(0.5,0.5)');
		// newRect.setAttribute('transform', `rotate(${getRandomInt(361)}, 200, 200)`);
		// newRect.setAttribute('transform', `rotate(15, 125, 125)`);
		newRect.addEventListener('pointerdown', figureMouseDown);
		svg.appendChild(newRect);
	};

	// inputImage.addEventListener('click', addFigure);
});