const trowError =  (message) => {
  const response = {
    status : 0,
    message : !message ? 'El error no se ha especificado' : message
  }
	return response
}

exports.trowError = trowError
