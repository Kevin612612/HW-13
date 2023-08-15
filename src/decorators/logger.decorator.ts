export function LogFunctionName() {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const functionName = propertyKey;
			const result = await originalMethod.apply(this, args);
			console.log(`${functionName} starts performing.`);
			return result;
		};

		return descriptor;
	};
}
