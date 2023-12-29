import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="ljubimci",
    # user=os.environ['DB_USERNAME'],
    # password=os.environ['DB_PASSWORD'])
)

# Open a cursor to perform database operations
cur = conn.cursor()
# cur.execute('DROP TABLE IF EXISTS oglasi;')
cur.execute('CREATE TABLE oglasi (id serial PRIMARY KEY,'
            'pet_name varchar (150) NOT NULL,'
            'phone varchar (20) NOT NULL,'
            'event_type varchar (20) NOT NULL,'
            'pet_family varchar (20) NOT NULL,'
            'comments text,'
            'has_chip boolean,'
            'date_added timestamptz DEFAULT CURRENT_TIMESTAMP);'
            )
conn.commit()
cur.close()
conn.close()
