function status(request, response) {
  response.status(200).json({
    key: "key value",
  });
}

export default status;
