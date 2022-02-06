# Basic-Script

Basic Script is a basic programming language created in javascript 

# Live Demo
Link https://gabrieltrinidad0101.github.io/Basic-Script/

# Create hello world
PRINT("hello world")

# Create variable
VAR a = 10

VAR a = "hello world"

VAR a = [1,2,3,4]

VAR a = TRUE

VAR a = FALSE

VAR a = fun Hello()-> "hello"

# Operation number
VAR a = 1 

VAR c = 2

VAR d = a + c   **a - c || a * c || a / c**

PRINT(d)


# If statement
VAR a = IF (10 == 10) THEN TRUE ELSE FALSE  **10 > 10 || 10 < 10 || 10 >= 10 || 10 <= 10 || 10 != 10**
PRINT(a)    **TRUE**

IF(10 == 10) THEN
    PRINT("TEN IS EQUAL TEN")
END

IF(10 != 10) THEN
    PRINT("TEN IS NOT EQUAL TEN")
ELIF(10 == 10) THEN
    PRINT("TEN IS EQUAL TEN")
END;


IF(10 != 10) THEN
    PRINT("TEN IS NOT EQUAL TEN")
ELIF(10 > 10) THEN
    PRINT("TEN IS GREATER THAN TEN")
ELSE
    PRINT("DEFAULT VALUE")
END;

# Loop

## WHILE

VAR i = 0
WHILE(i < 10) THEN
    PRINT(i)
    VAR i = i + 1
    **BREAK,CONTINUE**
END;

## FOR

FOR i = 0 TO 10 THEN
    PRINT(i)
    **BREAK,CONTINUE**
END;

FOR i = 0 TO 10 STEP 2 THEN
    PRINT(i)
END;

# Array
VAR a = [1,2,3,4,5]

## add value
PRINT(a + 6)

## remove value
PRINT(a - 1)    **remove of index**

## Get value
PRINT(a / 1)    **get value of index**

## Contact array
PRINT(a * [6,7,8])

# String

## add
VAR a = "hello"
PRINT(a + " world") **hello world**

## multiply
VAR a = "hello "
PRINT(a * 2) **hello hello**


# FUNCTION

FUN a(x,y) THEN
    RETURN x + y
END

CLEAR() **clear the console**
PRINT() **PRINT in the console**