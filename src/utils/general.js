const trowError =  (message) => {
  const response = {
    status : 0,
    message : !message ? 'No especificado' : message
  }
	return response
}

exports.trowError = trowError
