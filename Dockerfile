# Step 1: Use a base image
FROM python:3.10-slim

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the current directory contents into the container at /app
COPY . /app

# Step 4: Install any dependencies listed in requirements.txt
RUN pip install -r requirements.txt

# Step 7: Command to run the application
CMD python main.py
