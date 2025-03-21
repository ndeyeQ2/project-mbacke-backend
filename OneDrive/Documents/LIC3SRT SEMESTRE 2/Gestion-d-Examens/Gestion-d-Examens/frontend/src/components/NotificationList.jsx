import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';

const NotificationList = ({ idEtudiant }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`/api/notifications/${idEtudiant}`);
                setNotifications(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des notifications:', error);
            }
        };

        fetchNotifications();
    }, [idEtudiant]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            <div className="space-y-2">
                {notifications.map((notif) => (
                    <div key={notif.idNotification} className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-gray-800">{notif.message}</p>
                        <p className="text-sm text-gray-500">
                            {new Date(notif.dateEtHeure).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationList; 