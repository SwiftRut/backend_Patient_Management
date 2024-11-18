import admin from "../utils/firebase";
class NotificationService{

    static async sendNotification(deviceToken, title, body) {
        const message = {
            notification:{
                title, body
            },
            token:deviceToken
        }
        try{
            const response = admin.messaging().send(message);
            return response;
        }catch(error){
            console.log(error);
        }
    }
}

export default NotificationService;