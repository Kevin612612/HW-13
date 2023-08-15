/**
* This function, getFunctionName, retrieves the name of the calling function by analyzing the call stack.
* It accomplishes this by creating an error instance to capture the stack trace, then parsing the relevant line
* that contains information about the calling function. The extracted function name is returned as the result.
@returns {string} The name of the calling function obtained from the stack trace.
*/
export function getFunctionName(): string {
	const stack = new Error().stack;
	const callerLine = stack.split('\n')[2];
	const functionName = /\s+at (.+) \(/.exec(callerLine)[1];
	return functionName;
}