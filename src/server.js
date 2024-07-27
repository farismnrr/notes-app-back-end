const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const dotenv = require("dotenv");

// notes
const notes = require("./api/notes");
const NotesService = require("./services/postgres/NotesService");
const NotesValidator = require("./validator/notes");

// users
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users");

// authentications
const TokenManager = require("./tokenize/TokenManager");
const authentications = require("./api/auth");
const AuthenticationsService = require("./services/postgres/AuthService");
const AuthenticationsValidator = require("./validator/auth");

// collaborations
const collaborations = require("./api/collab");
const CollaborationsService = require("./services/postgres/CollabService");
const CollaborationsValidator = require("./validator/collab");

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
			plugin: Jwt
		}
	]);

	// mendefinisikan strategy autentikasi jwt
	server.auth.strategy("notesapp_jwt", "jwt", {
		keys: process.env.ACCESS_TOKEN_KEY,
		verify: {
			aud: false,
			iss: false,
			sub: false,
			maxAgeSec: process.env.ACCESS_TOKEN_AGE
		},
		validate: artifacts => ({
			isValid: true,
			credentials: {
				id: artifacts.decoded.payload.id
			}
		})
	});

	const usersService = new UsersService();
	const collaborationsService = new CollaborationsService();
	const authenticationsService = new AuthenticationsService();
	const notesService = new NotesService(collaborationsService);

	await server.register([
		{
			plugin: notes,
			options: {
				service: notesService,
				validator: NotesValidator
			}
		},
		{
			plugin: users,
			options: {
				service: usersService,
				validator: UsersValidator
			}
		},
		{
			plugin: authentications,
			options: {
				authenticationsService: authenticationsService,
				usersService: usersService,
				tokenManager: TokenManager,
				validator: AuthenticationsValidator
			}
		},
		{
			plugin: collaborations,
			options: {
				collaborationsService: collaborationsService,
				notesService: notesService,
				validator: CollaborationsValidator
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
