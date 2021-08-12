class Services {
    async getToken({userName, roomName}) {
        const token = await fetch('http://secret-retreat-99293.herokuapp.com/video/token', {
            method: 'POST',
            body: JSON.stringify({
              identity: userName,
              room: roomName
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => res.json());
        return token;
    }
}

export default new Services();