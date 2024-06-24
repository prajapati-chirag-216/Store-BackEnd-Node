const catchAsync = (callback) => {
  return (req, res, next) => {
    // Using an async function to handle asynchronous operations
    const asyncFunction = async (req, res, next) => {
      try {
        await callback(req, res, next);
      } catch (err) {
        next(err); // Pass the caught error to Express's error handling middleware
      }
    };

    // Invoke the async function
    asyncFunction(req, res, next);
  };
};
module.exports = catchAsync;
