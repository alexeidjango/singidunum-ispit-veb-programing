import psycopg2
import psycopg2.extras


def get_db_connection():
    conn = psycopg2.connect(host='localhost', database='ljubimci')
    return conn


def create_ad(**kwargs):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO oglasi (pet_name, phone, event_type, comments, has_chip, pet_family)'
                'VALUES (%s, %s, %s, %s, %s, %s)',
                (
                kwargs['pet_name'], kwargs['phone'], kwargs['event_type'], kwargs['comments'],
                bool(kwargs['has_chip']),kwargs['pet_family']))
    conn.commit()
    cur.close()
    conn.close()


def list_ads():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
    cur.execute("""
    SELECT  pet_name, 
            phone, 
            event_type, 
            comments, 
            has_chip, 
            CASE 
                WHEN pet_family = 'rabbit' THEN 'zec' 
                WHEN pet_family = 'cat' THEN 'mačka' 
                WHEN pet_family = 'dog' THEN 'pas' 
                ELSE 'životinje' 
            END pet_family,
            date_added
    FROM oglasi
    ORDER BY date_added DESC
    """)
    res = cur.fetchall()
    cur.close()
    conn.close()
    return res
