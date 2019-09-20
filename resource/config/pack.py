import os
import zipfile

path = './config'
zipf = zipfile.ZipFile('config.bin', 'w')
for file in os.listdir(path):
    file_path = os.path.join(path, file)
    zipf.write(file_path, file)
zipf.close()
