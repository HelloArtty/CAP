import os
import yolov5 # doc: py yolov5

# this is for solved error : PosixPath not found
import pathlib
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

import environ

env = environ.Env()

#TODO : get pic from cloud 
#TODO : pass image path to yolov5 model


#internal used function
def load_model(model_path):
    model = yolov5.load(model_path)
    return model

def predict(partial_img_url):
    HOME = os.getcwd()
    # Load the model
    model_path = HOME + "/users/Model/A.pt"
    model = load_model(model_path)
    
    # img_path = "C:/Users/smart/Downloads/iphone-13-finish-select-202207-pink.jpg" # iphone
    # img_path = "C:/Users/smart/Downloads/01_reuse_keys.jpg.optimal.jpg" # key
    # img_path = "image/upload/v1715155841/ynf7fhz23lxvuuuklqms.jpg" # cloudinary give only partial url
    
    '''
    cloudinary url overview:
    https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id_full_path>.<extension>
    '''
    cloud_name = env('CLOUD_NAME') + "/"
    complete_img_url = partial_img_url
    # perform inference
    results = model(complete_img_url)
    
    # parse results
    predictions = results.pred[0]
    #boxes = predictions[:, :4] # x1, y1, x2, y2
    #scores = predictions[:, 4] # confidence score
    #categories = predictions[:, 5] # ?
    
    # show detection bounding boxes on image
    results.show()
    
    # save results into "results/" folder
    #results.save(save_dir='results/')
    
    most_conf = 0
    for i in range(len(predictions)):
        if predictions[i,4] > most_conf:
            most_conf = predictions[i,4]
            best_confident_pred = predictions[i,:]
    
    best_scores = best_confident_pred[4] # confidence score
    categories = best_confident_pred[5] # ?

    return categories

#print(predict())
    


    
    


