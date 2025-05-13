<?php

header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Leer JSON del cuerpo de la petición
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$text = $data['text'] ?? '';

$text = mb_strtolower($text, 'UTF-8');

// Eliminar puntuación
$text = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $text);

// Separar palabras manualmente
$words = preg_split('/\s+/u', $text, -1, PREG_SPLIT_NO_EMPTY);

// Cargar stopwords
$stopwords = file(__DIR__ . '/../stopwords/es.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$stopwords = array_map('trim', $stopwords);
$stopwords = array_map('mb_strtolower', $stopwords);

// Eliminar stopwords
$filtered = array_filter($words, function($word) use ($stopwords) {
    return !in_array($word, $stopwords);
});

// Contar frecuencia
$frequencies = array_count_values($filtered);

// Ordenar por frecuencia descendente
arsort($frequencies);

// Devolver JSON
echo json_encode($frequencies, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

?>
