FROM openjdk:17-jdk-slim

# Salin file fat JAR aplikasi
COPY build/libs/pos-0.0.1-SNAPSHOT.jar app.jar

# Tentukan port
EXPOSE 8080

# Jalankan aplikasi
ENTRYPOINT ["java", "-jar", "/app.jar"]
