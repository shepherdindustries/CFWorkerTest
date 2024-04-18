import { Client } from 'pg';

async function handleRequest(request) {
	let client = null;
	try {
		client = new Client(DB_URL);
		await client.connect();
		const result = await client.query('SELECT * FROM TABLENAME');
		return new Response(JSON.stringify(result.rows), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Database connection error:', error);
		return new Response(JSON.stringify({ error: error.message }), {
			headers: { 'Content-Type': 'application/json' },
			status: 500,
		});
	} finally {
		if (client) {
			try {
				await client.end();
			} catch (err) {
				console.error('Failed to close database connection:', err);
			}
		}
	}
}

addEventListener('fetch', (event) => {
	event.respondWith(handleRequest(event.request));
});
