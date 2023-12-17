import { Logger } from '@nestjs/common';
import { getClassName } from '../secondary functions/getFunctionName';

export function LogClassName() {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const functionName = propertyKey;
			const result = await originalMethod.apply(this, args);
			const logger = new Logger(getClassName());
			logger.log(`${getClassName()} starts performing`); // ! that string is for vercel log reading
			return result;
		};

		return descriptor;
	};
}
