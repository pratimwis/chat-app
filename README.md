# ✨ Full Stack Realtime Chat App ✨

![Demo App](/frontend/public/screenshot-for-readme.png)


Highlights:

- 🌟 Tech stack: MERN + Socket.io + TailwindCSS + Daisy UI
- 🎃 Authentication && Authorization with JWT
- 👾 Real-time messaging with Socket.io
- 🚀 Online user status
- 👌 Global state management with Zustand
- 🐞 Error handling both on the server(App assert , App Error , catch Error) and on the client


### Setup `.env` file

### Backend (`/backend/.env`)

```env
MONGODB_URI=your_mongodb_uri
PORT=8000
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`/frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WEBSOCKET_URL=http://localhost:8000
```


### Build the app

```shell
npm run build
```

### Start the app

```shell
npm start
```
---

## Notes

- The backend serves the frontend's static files in production.
- For development, run backend and frontend separately.
- Make sure your `.env` files are set up as shown above.

---