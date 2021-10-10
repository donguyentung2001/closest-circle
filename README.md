# About this project

A React application that finds the circle with the least distance from a set of points. The website is deployed here: https://texting-b1b47.web.app/

# About the algorithm 

To generate the said circle, we use gradient descend algorithm. 

Let x, y, r be the x-y coordinate of the circle center and the radius of the circle, respectively. 

We initialize x,y, r with values 100, 100, and 1. 

At each iteration, we calculate the partial derivatives of the distance formula of the circle from the set of all points. 

We then update x, y, r as follows:

- If the partial derivative is negative, it means that the distance will decrease if the variable increases. Therefore, we increment the variable by an amount that is equal to our learning rate (which is 0.1) multiplied by the value of the partial derative.

- If the partial derivative is positive, it means that the distance will increase if the variable increases. Therefore, we decrement the variable by an amount that is equal to our learning rate (which is 0.1) multiplied by the value of the partial derative. 

We stop the loop once the partial derivatives are all low enough (0.5 in this case), or the number of iterations has exceeded 100. 