import { Logger } from "@nestjs/common";
import { getClassName } from "../secondary functions/getFunctionName";

export function LogFunctionName() {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const functionName = propertyKey;
			const result = await originalMethod.apply(this, args);
			const logger = new Logger(getClassName());
			logger.log(`done`);
			return result;
		};

		return descriptor;
	};
}
