class Notification {
  constructor(data = {}) {
    this.triggeredBy = data.triggeredBy;
    if (data.notificationType === 'message' || data.notificationType === 'voice' || data.notificationType === 'video') {
      this.notify = data.notify.map(value => {
        return {
          user_id: value
        };
      });
    } else {
      this.notify = data.notify;
    }
    this.pharmacy_id = data.pharmacy_id;
    this.notification = data.notification;
    this.notificationType = data.notificationType;
    this.typeStatus = data.typeStatus;
    this.data = data.data;
    this.role = data.role;
  }
}


module.exports.Notification = Notification;
