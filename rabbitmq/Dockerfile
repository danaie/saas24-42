# Use the official RabbitMQ image from the Docker Hub
FROM rabbitmq:3.13.2-management

# Expose the ports for RabbitMQ and RabbitMQ Management
# RabbitMQ server port
EXPOSE 5672

# RabbitMQ management plugin port
EXPOSE 15672

# Optional: Add environment variables to configure RabbitMQ settings
# These can also be set at runtime using the `-e` flag with `docker run`
# Example: set default user and password
ENV RABBITMQ_DEFAULT_USER=user
ENV RABBITMQ_DEFAULT_PASS=1234

# Optional: Copy custom configuration file if you have one
# COPY rabbitmq.config /etc/rabbitmq/rabbitmq.config

# Optional: Define a health check
HEALTHCHECK --interval=30s --timeout=30s --retries=3 CMD rabbitmq-diagnostics ping

# The default command will run the RabbitMQ server
CMD ["rabbitmq-server"]
