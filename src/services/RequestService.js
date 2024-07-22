const process = require("process");

class RequestService {
	constructor(server) {
		this._server = server;
	}

	onRequest(request, h) {
		request.plugins.startTime = process.hrtime();
		return h.continue;
	}

	onPreResponse(request, h) {
		const start = request.plugins.startTime;
		const end = process.hrtime(start);
		const responseTimeNs = end[0] * 1e9 + end[1];

		const method = request.method.toUpperCase();
		const paddedMethod = method.length < 6 ? method.padEnd(6, " ") : method;

		let responseTime;
		let unit;

		if (responseTimeNs < 1e3) {
			responseTime = responseTimeNs;
			unit = "ns";
		} else if (responseTimeNs < 1e6) {
			responseTime = responseTimeNs / 1e3;
			unit = "μs";
		} else if (responseTimeNs < 1e9) {
			responseTime = responseTimeNs / 1e6;
			unit = "ms";
		} else if (responseTimeNs < 1e12) {
			responseTime = responseTimeNs / 1e9;
			unit = "s";
		} else {
			responseTime = responseTimeNs / 1e12;
			unit = "minutes";
		}

		const response = request.response;
		const statusCode = response.isBoom ? response.output.statusCode : response.statusCode;

		console.log(
			`[ Bun - Hapi ] Code: ${statusCode} | Time: ${responseTime
				.toFixed()
				.padStart(3, " ")}${unit} | ${paddedMethod}\t${request.path}`
		);

		return h.continue;
	}
}

module.exports = RequestService;
