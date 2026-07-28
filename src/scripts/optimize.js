const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directory = path.resolve(__dirname, '../../public/flags');

function getFiles(dir, files_) {
    files_ = files_ || [];
    const files = fs.readdirSync(dir);
    for (let i in files) {
        const name = path.join(dir, files[i]);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

const allFiles = getFiles(directory);
console.log(`Found ${allFiles.length} files in public/flags`);

const jobs = [];

allFiles.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        const newFile = file.slice(0, -ext.length) + '.webp';
        console.log(`Optimizing: ${file} -> ${newFile}`);
        const p = sharp(file)
            .resize(800, 800, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toFile(newFile)
            .then(() => {
                console.log(`Optimized successfully: ${newFile}`);
                fs.unlinkSync(file);
            })
            .catch(err => {
                console.error(`Error optimizing ${file}:`, err);
            });
        jobs.push(p);
    }
});

Promise.all(jobs).then(() => {
    console.log('All image optimization jobs finished!');
});
