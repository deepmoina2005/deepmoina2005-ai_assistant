CREATE DATABASE IF NOT EXISTS ai_assistant;
USE ai_assistant;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE documents (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    extracted_text TEXT NULL,
    upload_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('processing','ready','failed') DEFAULT 'processing',
    chunks LONGTEXT NULL,

    PRIMARY KEY (id),
    KEY user_id (user_id),
    CONSTRAINT fk_documents_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE document_chunks (
    id INT NOT NULL AUTO_INCREMENT,
    document_id INT NOT NULL,
    content TEXT NOT NULL,
    page_number INT DEFAULT 0,
    chunk_index INT NOT NULL,

    PRIMARY KEY (id),
    KEY document_id (document_id),
    CONSTRAINT fk_chunks_document
        FOREIGN KEY (document_id) REFERENCES documents(id)
        ON DELETE CASCADE
);

CREATE TABLE flashcards (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    document_id INT NOT NULL,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY user_id (user_id),
    KEY document_id (document_id),
    CONSTRAINT fk_flashcards_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_flashcards_document
        FOREIGN KEY (document_id) REFERENCES documents(id)
        ON DELETE CASCADE
);

CREATE TABLE flashcard_items (
    id INT NOT NULL AUTO_INCREMENT,
    flashcard_id INT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    difficulty ENUM('easy','medium','hard') DEFAULT 'medium',
    last_reviewed TIMESTAMP NULL,
    review_count INT DEFAULT 0,
    is_starred TINYINT(1) DEFAULT 0,

    PRIMARY KEY (id),
    KEY flashcard_id (flashcard_id),
    CONSTRAINT fk_flashcard_items_flashcard
        FOREIGN KEY (flashcard_id) REFERENCES flashcards(id)
        ON DELETE CASCADE
);

CREATE TABLE cards (
    id INT NOT NULL AUTO_INCREMENT,
    flashcard_set_id INT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    last_reviewed DATETIME NULL,
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY flashcard_set_id (flashcard_set_id),
    CONSTRAINT fk_cards_flashcard_set
        FOREIGN KEY (flashcard_set_id) REFERENCES flashcards(id)
        ON DELETE CASCADE
);

CREATE TABLE quizzes (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    document_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    questions JSON NULL,
    total_questions INT DEFAULT 0,
    user_answers JSON NULL,
    score INT DEFAULT 0,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,

    PRIMARY KEY (id),
    KEY user_id (user_id),
    KEY document_id (document_id),
    CONSTRAINT fk_quizzes_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_quizzes_document
        FOREIGN KEY (document_id) REFERENCES documents(id)
        ON DELETE CASCADE
);

CREATE TABLE quiz_questions (
    id INT NOT NULL AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    question TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT NULL,
    difficulty ENUM('easy','medium','hard') DEFAULT 'medium',

    PRIMARY KEY (id),
    KEY quiz_id (quiz_id),
    CONSTRAINT fk_quiz_questions_quiz
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
        ON DELETE CASCADE
);

CREATE TABLE quiz_user_answers (
    id INT NOT NULL AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    question_index INT NOT NULL,
    selected_answer VARCHAR(255) NOT NULL,
    is_correct TINYINT(1) NOT NULL,
    answered_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY quiz_id (quiz_id),
    CONSTRAINT fk_quiz_answers_quiz
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
        ON DELETE CASCADE
);

CREATE TABLE quiz_options (
    id INT NOT NULL AUTO_INCREMENT,
    question_id INT NOT NULL,
    option_text VARCHAR(500) NOT NULL,
    is_correct TINYINT(1) DEFAULT 0,

    PRIMARY KEY (id),
    KEY question_id (question_id),
    CONSTRAINT fk_quiz_options_question
        FOREIGN KEY (question_id) REFERENCES quiz_questions(id)
        ON DELETE CASCADE
);

CREATE TABLE creations (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,

    title VARCHAR(255) NULL,
    prompt TEXT NULL,

    description TEXT NULL,
    content LONGTEXT NOT NULL,
    type VARCHAR(50) NOT NULL,

    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY user_id (user_id),
    CONSTRAINT fk_creations_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);