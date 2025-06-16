const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // само за локално, Netlify си зарежда env

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  const { data, error } = await supabase
    .from('your_table_name')  // смени с твоята таблица
    .select('*');

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};