# disinstallare google translator e installare deep_translator
import emoji
from deep_translator import GoogleTranslator
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

class SentimentAnalyzer:

    def __init__(self, src_lang = "it", dest_lang = "en", comp_thresh = 0.25, ):
        self.analyzer = SentimentIntensityAnalyzer()
        self.translator = GoogleTranslator(source=src_lang, target=dest_lang)
        self.SOURCE_LANGUAGE = src_lang
        self.DESTINATION_LANGUAGE = dest_lang
        self.COMPOUND_THRESH = comp_thresh
        self.POSITIVE = 1
        self.NEGATIVE = -1
        self.NEUTRAL = 0

    # Funzione che traduce un testo da italiano a inglese per sentiment analysis,
    # i modelli di nltk sono addestrati in inglese
    def translate_italian_to_english(self, text):
        translation = self.translator.translate(text)
        return translation

    # Funzione che rimuove emoji dal testo per il pre-processing
    def giveEmojiFreeText(self, text):
        return emoji.replace_emoji(text, replace='')

    # Funzione che pre-processa il testo prima della sentiment
    def preProcessText(self, text):
        # Tokenize the text
        tokens = word_tokenize(text.lower())

        # Remove stop words
        filtered_tokens = [token for token in tokens if token not in stopwords.words('italian')]

        # Lemmatize the tokens
        lemmatizer = WordNetLemmatizer()
        lemmatized_tokens = [lemmatizer.lemmatize(token) for token in filtered_tokens]

        # Join the tokens back into a string
        processed_text = ' '.join(lemmatized_tokens)

        # Ritorna il testo processato
        return processed_text

    # create get_sentiment function
    # 1 -> Sentimento Positivo, 0 -> Sentimento Neutro, -1 -> Sentimento Negativo
    def get_sentiment(self, text):
        scores = self.analyzer.polarity_scores(text)
        val = scores["compound"]
        if val >= self.COMPOUND_THRESH:
            return self.POSITIVE
        elif val <= -1*(self.COMPOUND_THRESH):
            return self.NEGATIVE
        else:
            return self.NEUTRAL
        return val

    # Funzione che esegue la sentiment analysis in diversi step
    # - rimozione emoji -> traduzione in inglese -> pre-processing -> sentiment score
    def sentimentAnalysis(self, msg):
        # Filtraggio emoji
        msg_without_emoji = self.giveEmojiFreeText(msg)

        # Messaggio tradotto in inglese
        msg_translated = self.translate_italian_to_english(msg_without_emoji)

        # Messaggio processato
        msg_processed = self.preProcessText(msg_translated)

        # Sentiment Analysis
        score = self.get_sentiment(msg_processed)
        return score