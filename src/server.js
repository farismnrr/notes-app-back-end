import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import notes from "./api/notes";
import NotesService from "./services/inMemory/NotesService";
import NotesValidator from "./validator/notes";
import RequestService from "./services/RequestService";
import ClientError from "./exceptions/ClientError";

dotenv.config();

const createServer = () => {
	const server = Hapi.server({
		port: process.env.PORT || 3000,
		host: process.env.HOST || "localhost",
		routes: {
			cors: {
				origin: ["*"]
			}
		}
	});

	return server;
};

const registerPlugins = async server => {
	await server.register({
		plugin: notes,
		options: {
			service: new NotesService(),
			validator: NotesValidator
		}
	});
};

const setupRequestService = server => {
	if (process.env.NODE_ENV !== "production") {
		server.ext("onRequest", (request, h) => new RequestService().onRequest(request, h));
		server.ext("onPreResponse", (request, h) => new RequestService().onPreResponse(request, h));
	}
};

const handleClientError = server => {
	server.ext("onPreResponse", (request, h) => {
		const { response } = request;
		if (response instanceof ClientError) {
			const newResponse = h.response({
				status: "fail",
				message: response.message
			});
			newResponse.code(response.statusCode);
			return newResponse;
		}
		return h.continue;
	});
};

const startServer = async () => {
	const server = createServer();
	await registerPlugins(server);
	setupRequestService(server);
	handleClientError(server);
	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};

startServer();
