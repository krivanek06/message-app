## Overview

Application is a small version of a real-time chatting app. Once users
choose an username, they are joined to a shared chat room. Messages are stored in-memory and messages are not deleted even if the user left from the room

### Application Start

To run the application, you need to install all dependencies and run both backend and frontend:
1.) `npm i --legacy-peer-deps`
2.) run backend by `npm run serve:server`
3.) run frontend by `npm run serve:client`

### Testing

Some tests were added to both the backend and frontend. To run the tests, run `npm run test`.

### Dependencies

- tailwind
- fakerJS
- ngx-socket-io
- ng-mocks
- jest-when
