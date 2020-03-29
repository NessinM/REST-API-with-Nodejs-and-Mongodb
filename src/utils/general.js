const trowError =  (message, status = 0) => {
  const response = {
    status,
    message : !message ? 'El error no se ha especificado' : message
  }
	return response
}

exports.trowError = trowError
