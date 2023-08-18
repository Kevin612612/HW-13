//for taking data from here we need to load this module into ConfigModule with option "load: [configuration]""
export const getConfiguration = () => {
	return {
		port: process.env.PORT || '3232',
		environment: process.env.NODE_ENV || 'development',
	};
};

type ConfigurationConfigType = ReturnType<typeof getConfiguration>;
