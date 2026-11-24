from .connection import get_connection

def init_database():
    conn = get_connection()
    cur = conn.cursor()

    with open("helpers/database/schema.sql", "r", encoding="utf-8") as f:
        sql_script = f.read()

    cur.execute(sql_script)

    cur.execute("ALTER TABLE filme ADD COLUMN IF NOT EXISTS sinopse TEXT")
    cur.execute("""
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = current_schema()
                  AND table_name = 'filme'
                  AND column_name = 'roteiro'
            ) THEN
                EXECUTE 'UPDATE filme SET sinopse = COALESCE(sinopse, roteiro)';
            END IF;
        END $$;
    """)

    conn.commit()
    cur.close()
    conn.close()

    print("Banco inicializado com sucesso.")
