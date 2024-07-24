const globals = require("globals");

module.exports = {
	languageOptions: {
		ecmaVersion: "latest",
		sourceType: "commonjs",
		globals: {
			...globals.browser
		}
	},
	rules: {
		"linebreak-style": "off",
		"import/no-extraneous-dependencies": "off",
		"no-console": "off",
		indent: "off",
		"import/no-unresolved": "off",
		"consistent-return": "off",
		"max-len": "off",
		"function-paren-newline": "off",
		"implicit-arrow-linebreak": "off",
		"no-trailing-spaces": "off",
		"no-shadow": "off"
	}
};
