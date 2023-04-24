
import { io } from '../server'

io.on('connection', socket => {
    console.log("Someone connected");
    socket.on('join-room', ({ roomId, userName }) => {
        console.log("User joined room");
        if (roomId && userName) {
            socket.join(roomId);
            addUser({ userName, roomId });
            socket.to(roomId).emit('user-connected', userName);
            io.to(roomId).emit('all-users', getRoomUsers(roomId));
        }
        socket.on('disconnect', () => {
            console.log("User disconnected");
            socket.leave(roomId);
            userLeave(userName);
            io.to(roomId).emit('all-users', getRoomUsers(roomId));
        });
    });

    socket.on('open-comemnts-post', async ({ idPost, idUser, token }) => {
        console.log("Open comments post " + idPost + " " + idUser + " " + token);
        if (idPost && idUser && token) {
            socket.join(idPost);
            // join user to room  post
            getAllCommentPostApi(token, idPost);
            socket.to(idPost).emit('user-connected', idUser);
            socket.on('create-comment', async () => {
                getAllCommentPostApi(token, idPost);
            });
            // edit comment
            socket.on('edit-comment', async () => {
                getAllCommentPostApi(token, idPost);
            });
            // delete comment
            socket.on('delete-comment', async () => {
                getAllCommentPostApi(token, idPost);
            });
            socket.on('disconnect', () => {
                console.log("User disconnected");
                socket.leave(idPost);
            });
        }
    });

    socket.on('open-app-weley', ({ token }) => {
        if (token) {
            console.log(token);
            socket.join(token);
        }
        socket.on('disconnect', () => {
            socket.leave(token);
        })
    });
    socket.on('open-post', ({ idPost, token }) => {
        if (idPost && token) {
            socket.join(idPost);
            console.log("Open post " + idPost + " " + token);
            socket.on('disconnect', () => {
                socket.leave(idPost);
            });
            // like post
        }
    });
    socket.on('edit-post', ({ id_Post }) => {
        updateSomeInfoPost(id_Post);
    });
    // delete-post
    socket.on('delete-post', ({ id_Post }) => {
        // console.log("Delete post " + id_Post);
        socket.leave(id_Post);
        io.to(id_Post).emit('delete-post-client', id_Post);
    });
})

