import os
from urllib.request import urlopen
import pymysql
import smtplib
from email.message import EmailMessage

db_config = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "user": os.environ.get("DB_USER", "user"),
    "password": os.environ.get("DB_PASS", ""),
}


def get_user_input():
    """Prompt the user to enter their name."""
    return input("Enter your name: ")


def send_email(to, subject, body):
    """Send an email using the local SMTP server."""
    msg = EmailMessage()
    msg.set_content(body)
    msg["Subject"] = subject
    msg["From"] = "no-reply@example.com"
    msg["To"] = to

    with smtplib.SMTP("localhost") as server:
        server.send_message(msg)


def get_data():
    """Fetch data from a secure API endpoint."""
    url = "https://secure-api.com/get-data" 
    data = urlopen(url).read().decode() #nosec B310
    return data


def save_to_db(data):
    """Save data safely to the database using parameterized queries."""
    query = "INSERT INTO mytable (column1, column2) VALUES (%s, %s)"
    connection = pymysql.connect(**db_config)
    cursor = connection.cursor()
    cursor.execute(query, (data, "Another Value"))
    connection.commit()
    cursor.close()
    connection.close()


if __name__ == "__main__":
    user_input = get_user_input()
    data = get_data()
    save_to_db(data)
    send_email("admin@example.com", "User Input", user_input)
