const Hapi = require("@hapi/hapi");
const dotenv = require("dotenv");

// notes
const notes = require("./api/notes");
const NotesService = require("./services/postgres/NotesService");
const NotesValidator = require("./validator/notes");

// users
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users");

const RequestService = require("./services/RequestService");
const ClientError = require("./exceptions/ClientError");

dotenv.config();

const createServer = () => {
	const server = Hapi.server({
		port: process.env.PORT || 8080,
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
	await server.register([
		{
			plugin: notes,
			options: {
				service: new NotesService(),
				validator: NotesValidator
			}
		},
		{
			plugin: users,
			options: {
				service: new UsersService(),
				validator: UsersValidator
			}
		}
	]);
};

const setupRequestService = server => {
	if (process.env.NODE_ENV !== "production") {
		const requestService = new RequestService();
		server.ext("onRequest", requestService.onRequest);
		server.ext("onPreResponse", requestService.onPreResponse);
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
