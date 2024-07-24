const Hapi = require("@hapi/hapi");
const routes = require("./routes");
const process = require("process");

const init = async () => {
	const server = Hapi.server({
		port: process.env.PORT || 3000,
		host: process.env.HOST || "localhost",
		routes: {
			cors: {
				origin: ["*"]
			}
		}
	});

	server.ext("onRequest", (request, h) => {
		request.plugins.startTime = process.hrtime();
		return h.continue;
	});

	server.ext("onPreResponse", (request, h) => {
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
			unit = "Ms";
		}

		const response = request.response;
		const statusCode = response.isBoom ? response.output.statusCode : response.statusCode;

		console.log(
			`[ Bun - Hapi ] Code: ${statusCode} | Time: ${responseTime
				.toFixed()
				.padStart(3, " ")}${unit} | ${paddedMethod}\t${request.path}`
		);

		return h.continue;
	});

	server.route(routes);

	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
	console.log(err);
	process.exit(1);
});

init();
