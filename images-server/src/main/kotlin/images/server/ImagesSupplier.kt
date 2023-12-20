package images.server

import java.io.File
import java.lang.Exception
import java.nio.file.Files
import java.util.*


class ImagesSupplier(val rootFolder: File, val deletedPhotosFolder: File):Runnable {



    var _listOfImages:MutableList<String> = mutableListOf()
    val listOfImagesLock = "listOfImagesLock"
    val rnd = Random()

    val imagesRefresherThread = Thread( this,"Images list refresher")


    init {
        if( !deletedPhotosFolder.exists()){
            println("Creating folder for deleted images: ${deletedPhotosFolder.absolutePath}")
            deletedPhotosFolder.mkdirs()
        }
        if( ! rootFolder.exists() ){
            println("Creating folder for images ${rootFolder.absolutePath}")
        }
        collectAllFiles()
        imagesRefresherThread.start()
    }

    fun rootDirForKtor():File {
        return rootFolder.parentFile
    }


    fun  getRandomImage():ImageAndCatalogInfo{
        val listOfImages = getListOfImages()
        val imageUri = listOfImages[rnd.nextInt( listOfImages.size )]
        val lastUpdated = lastImageUpdate
        val numImages = listOfImages.size
        return ImageAndCatalogInfo(imageUri, numImages, lastUpdated)
    }

    var lastImageUpdate:Long = 0L
    fun hasImageUpdates():Boolean {
        var lastModified = 0L
        var count = 0
        rootFolder.walkTopDown().forEach { file ->
            if( isImageFile(file) ) {
                val updateTime = file.lastModified()
                count ++
                if( lastModified < updateTime ){
                    lastModified = updateTime
                }
            }
        }
        return lastImageUpdate != lastModified || count != getListOfImages().size
    }
    fun collectAllFiles() {
        val rootFolderName = rootFolder.absolutePath
        println("Collecting images in folder $rootFolderName")
        val bufferForImages:MutableList<String> = mutableListOf()
        var counter = 0
        var lastModified = 0L
        rootFolder.walkTopDown().forEach { file ->
             if( isImageFile(file) ) {
                 val updateTime = file.lastModified()
                 if( lastModified < updateTime ){
                      lastModified = updateTime
                 }
                 val uri = file.absolutePath.substring(rootFolderName.length + 1)
                 bufferForImages.add(uri)
//                 println(" $uri")
                 counter ++
             }

         }
        setlistOfImages( bufferForImages )
        lastImageUpdate = lastModified
        println("Collected $counter images")
    }

    private fun setlistOfImages(images: MutableList<String>) {
        synchronized( listOfImagesLock) {
            _listOfImages = images
        }
    }
    private fun getListOfImages(): MutableList<String> {
        synchronized(listOfImagesLock){
            return _listOfImages
        }
    }

    private fun isImageFile(file: File): Boolean {
       val fileName = file.name.toUpperCase()
        return fileName.endsWith("JPG")||fileName.endsWith("PNG")||fileName.endsWith("JPEG")
    }

    fun deleteImage(imgPath: String): Boolean {
       try {
           println("to be deleted: $imgPath")
           val originalFile = File(rootFolder, imgPath)
           val newFileLocation = File(deletedPhotosFolder, imgPath)
           val newFileFolder = newFileLocation.parentFile
           if (!newFileFolder.exists()) {
               newFileFolder.mkdirs()
           }
           Files.move(originalFile.toPath(), newFileLocation.toPath())
           val deleted = getListOfImages().removeIf { ii -> ii == imgPath }
           if (deleted) {
               println("Image was deleted:$imgPath")
           }
           return true;
       }catch (ex:Exception){
           ex.printStackTrace()
           throw ex
       }
    }

    override fun run() {
        while( true ) {
//            println("Checking for updates")
            try {
                if (hasImageUpdates()) {
                    collectAllFiles()
                }
            } catch (e: Throwable) {
                println("Got error: $e")
                e.printStackTrace()
            }
            Thread.sleep( 30000 )
        }
    }
}


data class ImageAndCatalogInfo(val uri:String, val numImages:Int, val lastUpdated:Long)
