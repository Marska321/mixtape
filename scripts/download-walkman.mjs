import https from 'https';
import fs from 'fs';
import path from 'path';

const url = 'https://c.animaapp.com/mowjxgtxILU0cG/assets/icon-2.svg';
const outPath = path.join(process.cwd(), 'public', 'walkman.svg');

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    // Remove the static volume knob — it's a <g class="cursor-ns-resize"> element
    // Use a simple string approach to avoid regex flag issues
    const start = data.indexOf('<g class="cursor-ns-resize"');
    if (start !== -1) {
      const end = data.indexOf('</g>', start) + 4;
      data = data.slice(0, start) + data.slice(end);
      console.log('Static knob removed.');
    } else {
      console.log('Knob not found by class, continuing...');
    }
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, data, 'utf8');
    console.log('Saved to', outPath, '- bytes:', data.length);
  });
}).on('error', (e) => console.error('Download error:', e));
