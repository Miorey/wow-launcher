export class ConnectionPromise {
  constructor (conn) {
    this._conn = conn;
  }

  connSize (fileUrl) {
    return new Promise((resolve, reject) => {
      this.conn.size(fileUrl, (err, bytes) => {
        if(!err) resolve(bytes);
        else reject(err);
      });
    });
  }
  connGet (fileUrl) {
    return new Promise((resolve, reject) => {
      this.conn.get(fileUrl, (err, stream) => {
        if(!err) resolve(stream);
        else reject(err);
      });
    });
  }


  get conn() {
    return this._conn;
  }

}

export class StreamPromise {
  constructor(stream) {
    this._stream = stream;
  }

  once(type) {
    return new Promise((resolve) => {
      this.stream.once(type, () => {
        resolve();
      });
    });
  }

  get stream() {
    return this._stream;
  }
}