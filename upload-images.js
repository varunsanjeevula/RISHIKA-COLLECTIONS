const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Connecting to Supabase...');

  // 1. Create bucket if not exists
  const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
  if (bucketErr) {
    console.error('Error listing buckets', bucketErr);
    return;
  }
  let bucket = buckets.find(b => b.name === 'product-images');
  if (!bucket) {
    console.log('Creating public bucket: product-images...');
    const { error: createErr } = await supabase.storage.createBucket('product-images', { public: true });
    if (createErr) {
      console.error('Error creating bucket', createErr);
      return;
    }
    console.log('Created bucket: product-images');
  } else {
    console.log('Bucket product-images exists.');
  }

  // 2. Read products from DB
  const { data: products, error: prodErr } = await supabase.from('products').select('*');
  if (prodErr) {
    console.error('Error fetching products', prodErr);
    return;
  }

  console.log(`Found ${products.length} products. Uploading local images to Supabase...`);

  // 3. Upload images and update DB
  for (const product of products) {
    if (product.image_url && product.image_url.startsWith('/products/')) {
      const fileName = path.basename(product.image_url);
      const filePath = path.join(__dirname, 'public', 'products', fileName);
      
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        
        console.log(`Uploading ${fileName}...`);
        // Upload to Supabase Storage
        const { data, error: uploadErr } = await supabase.storage
          .from('product-images')
          .upload(fileName, fileBuffer, {
            contentType: 'image/png',
            upsert: true
          });
          
        if (uploadErr) {
          console.error(`Error uploading ${fileName}:`, uploadErr);
          continue;
        }
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
          
        const publicUrl = publicUrlData.publicUrl;
        
        // Update product in DB
        const { error: updateErr } = await supabase
          .from('products')
          .update({ image_url: publicUrl })
          .eq('id', product.id);
          
        if (updateErr) {
          console.error(`Error updating product ${product.id}:`, updateErr);
        } else {
          console.log(`✅ Updated ${product.name} with public image URL`);
        }
      } else {
         console.log(`⚠️ Local file not found: ${filePath}`);
      }
    }
  }
  console.log('Done uploading all images!');
}

main();
