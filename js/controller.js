export default class Controller {

	constructor() {
		this.width = 500;
		this.height = 500;

		this.period = 20;
		this.animAmt = 0;
	}

	update(dt) {
		this.animAmt += dt / this.period;
		this.animAmt %= 1;
	}

	/**
	 * 
	 * @param {CanvasRenderingContext2D} context 
	 */
	render(context) {
		const angle = 2 * Math.PI * this.animAmt;

		context.rotate(angle);

		this.renderBg(context, 2 * angle);
		this.renderSquares(context, 2 * angle);
	}

	renderSquares(context, angle) {
		const edge = Math.max(this.width, this.height)
		const size = 50;
		let startIX = 0;
		let startIY = 0.5;
	
		while (size * startIX > -edge / 2) {
			startIX --;
		}
		while (0.5 * size * startIY > -edge / 2) {
			startIY --;
		}
	
		for (let iy = startIY; 0.5 * size * (iy - 1) < edge / 2; iy ++) {
			let yAmt = 2 * 0.5 * size * iy / edge;
			const type = posMod(iy, 2) < 1
			const color = type ? 'black' : 'white';
			const rowOffset = type ? 0 : 0.5;
	
			for (let ix = startIX + rowOffset - 1; size * (ix - 1) < edge / 2; ix ++) {
				let xAmt = 2 * size * ix / edge;

				// rotate x and y amts;
				const xAmt2 = Math.cos(angle) * xAmt - Math.sin(angle) * yAmt;
				const yAmt2 = Math.sin(angle) * xAmt + Math.cos(angle) * yAmt;
				if (xAmt2 > 0.15 && color == 'black') {
					continue;
				}
				if (xAmt2 < -0.15 && color == 'white') {
					continue;
				}

				let splitAmt = (xAmt2 > 0) ? xAmt2 : -xAmt2;
				splitAmt -= 0.25;
				if (splitAmt < 0) splitAmt = 0;
				splitAmt = Math.pow(splitAmt, 2) * 2;

				let rotAmt = splitAmt * yAmt2;
				if (xAmt2 < 0) {
					rotAmt = -rotAmt;
				}

				let xPos = size * ix * (1 + splitAmt);
				let yPos = 0.5 * size * iy * (1 + splitAmt);
				drawSquare(context, xPos, yPos, 4 * Math.PI * rotAmt, color, size / 2);
			}
		}
	}
	
	renderBg(context, angle) {
		context.rotate(-angle);

		context.fillStyle = 'black';
		context.beginPath();
		context.moveTo(0, -this.height);
		context.lineTo(this.width, -this.height);
		context.lineTo(this.width, this.height);
		context.lineTo(0,  this.height);
		context.closePath();
		context.fill();

		context.rotate(angle);
	}
}

function posMod(a, b) {
	let out = a % b;
	if (out < 0) {
		out += b;
	}
	return out;
}

/**
 * @param {CanvasRenderingContext2D} context 
 */
function drawSquare(context, x, y, angle, color, size) {
	let radius = size;
	context.fillStyle = color;
	context.beginPath();
	for (let i = 0; i < 4; i ++) {
		let amt = (i / 4);
		let localAngle = 2 * Math.PI * amt;
		let localX = radius * Math.cos(angle + localAngle);
		let localY = radius * Math.sin(angle + localAngle);
		if (i == 0) {
			context.moveTo(x + localX, y + localY);
		}
		else {
			context.lineTo(x + localX, y + localY);
		}
	}
	context.closePath();
	context.fill();
}