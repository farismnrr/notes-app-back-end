const Hapi = require("@hapi/hapi");
const notes = require("./api/notes");
const NotesService = require("./services/inMemory/NotesService");
const RequestService = require("./services/RequestService");

const dotenv = require("dotenv");
dotenv.config();

const init = async () => {
	const notesService = new NotesService();
	const requestService = new RequestService();

	const server = Hapi.server({
		port: process.env.PORT || 3000,
		host: process.env.HOST || "localhost",
		routes: {
			cors: {
				origin: ["*"]
			}
		}
	});

	if (process.env.NODE_ENV !== "production") {
		server.ext("onRequest", (request, h) =>
			requestService.onRequest(request, h)
		);

		server.ext("onPreResponse", (request, h) =>
			requestService.onPreResponse(request, h)
		);
	}

	await server.register({
		plugin: notes,
		options: {
			service: notesService
		}
	});

	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
