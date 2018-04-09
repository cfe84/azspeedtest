Tests the upload speed to Azure blob storage. This takes a URL to a blob container with a SAS in parameter, then tests speed for:

- uploading one file as a block, 
- one file in parallel chunks, 
- several files and in parallel.

## Install

```
npm install -g azspeedtest
```

## Usage

*Pre-requisite*: Generate a shared access signature for a blob container. The SAS must have write access to the container.
It will look like: https://myaccount.blob.core.windows.net/speed-test?st=2018-04-09T12%3A49%3A00Z&se=2018-05-10T12%3A49%3A00Z&sp=rwdl&sv=2017-04-17&sr=c&sig=%2BnH4OrCflkgdldiqjZcLCvHZAFbR19ISrTGLk1oVmPQ%3D`.

```sh
azspeedtest --url="<URL WITH SAS>" --size=10 --chunks=5

#### OUTPUTS:
# Upload one 10MB file as a block: 1.52 Mb/s...
# Upload one 10MB file in 5 chunks: 1.54 Mb/s...
# Upload 5 x 2MB files in parallel: 1.48 Mb/s...
# Done                           .
```

The command also writes a result file in the container.

*Options*:

- `url` specifies the URL with SAS to the container
- `size` specifies the upload size in MB. Defaults to 10MB.
- `chunks` specifies the decomposition level in chunks. I.e. it will upload the file in x chunks, and x files in parallel. Defaults to 4.
- `no-cleanup` prevents cleanup at the end of the test