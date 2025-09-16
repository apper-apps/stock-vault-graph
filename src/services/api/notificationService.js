const { ApperClient } = window.ApperSDK;

class NotificationService {
  constructor() {
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'notification_c';
  }

  async getUserNotifications(userId) {
    try {
      const params = {
        fields: [
          { field: { Name: 'Name' } },
          { field: { Name: 'userId_c' } },
          { field: { Name: 'message_c' } },
          { field: { Name: 'timestamp_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'productId_c' } }
        ],
        where: [
          {
            FieldName: 'userId_c',
            Operator: 'EqualTo',
            Values: [userId]
          }
        ],
        orderBy: [
          {
            fieldName: 'timestamp_c',
            sorttype: 'DESC'
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notifications:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async createNotification(notificationData) {
    try {
      const params = {
        records: [
          {
            Name: notificationData.Name,
            userId_c: notificationData.userId_c,
            message_c: notificationData.message_c,
            timestamp_c: notificationData.timestamp_c,
            status_c: notificationData.status_c || 'Unread',
            productId_c: notificationData.productId_c
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create notification ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          return null;
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating notification:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async markAsRead(notificationId) {
    try {
      const params = {
        records: [
          {
            Id: notificationId,
            status_c: 'Read'
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update notification ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          return false;
        }

        return successfulUpdates.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating notification:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
}

export const notificationService = new NotificationService();