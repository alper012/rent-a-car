class Response {
  constructor(success, message, data) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  /** Success: true */
  static success(res, data, message = 'Success') {
    return res.status(200).json(new Response(true, message, data));
  }

  static created(res, data, message = 'Created') {
    return res.status(201).json(new Response(true, message, data));
  }

  static updated(res, data, message = 'Updated') {
    return res.status(200).json(new Response(true, message, data));
  }

  static deleted(res, message = 'Deleted') {
    return res.status(200).json(new Response(true, message, {}));
  }

  static badRequest(res, message = 'Bad Request') {
    return res.status(400).json(new Response(false, message, {}));
  }

  static serverError(res, message = 'Internal Server Error') {
    return res.status(500).json(new Response(false, message, {}));
  }

  static custom(res, status, message) {
    return res.status(status).json(new Response(false, message, {}));
  }
}

module.exports = Response;
