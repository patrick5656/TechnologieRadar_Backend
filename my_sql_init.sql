CREATE TABLE Technology (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    ring VARCHAR(50),
    description TEXT NOT NULL,
    ring_description TEXT,
    published BOOLEAN NOT NULL,
    created_by_user_id INT NOT NULL,
    created_at DATETIME NOT NULL,
    published_at DATETIME,
    last_updated DATETIME,
    last_updated_by_user_id INT NOT NULL
);